import { auth, db } from '@/firebaseConfig'; // Compat SDK
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface Transaction {
    id: string;
    title: string;
    amount: string;
    date: string;
    icon: string;
    category: string;
    createdAt: any; // Timestamp
}

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to real-time data
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setTransactions([]);
            return;
        }

        // Compat Syntax: db.collection().doc()...
        const unsubscribe = db.collection('users')
            .doc(user.uid)
            .collection('transactions')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .onSnapshot(
                (snapshot) => {
                    const fetched: Transaction[] = [];
                    snapshot.forEach((doc) => {
                        fetched.push({ id: doc.id, ...doc.data() } as Transaction);
                    });
                    setTransactions(fetched);
                    setLoading(false);
                },
                (error) => {
                    console.error("Firestore Error:", error);
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, []);

    // Add function
    const addTransaction = async (amount: string, title: string, category: { id: string, icon: string }) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await db.collection('users').doc(user.uid).collection('transactions').add({
                title,
                amount: parseFloat(amount).toFixed(2), // Ensure string format like "$45.20" usually expected as string in UI or number in DB. Storing as formatted string for simplicity based on mock data, but number is better. Let's store as string to match mock for now perfectly.
                date: 'Today', // For MVP, just hardcode 'Today' or use strict formatting. Let's use real date string.
                category: category.id,
                icon: category.icon,
                createdAt: new Date() // Firestore timestamp auto-convert from Date
            });
            return true;
        } catch (error: any) {
            console.error("Add Error:", error);
            Alert.alert("Error", "Could not save expense.");
            return false;
        }
    };

    // Delete function
    const deleteTransaction = async (id: string) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await db.collection('users').doc(user.uid).collection('transactions').doc(id).delete();
            return true;
        } catch (error) {
            console.error("Delete Error:", error);
            Alert.alert("Error", "Could not delete expense.");
            return false;
        }
    };

    // Update function
    const updateTransaction = async (id: string, amount: string, title: string, category: { id: string, icon: string }) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await db.collection('users').doc(user.uid).collection('transactions').doc(id).update({
                title,
                amount: parseFloat(amount).toFixed(2),
                category: category.id,
                icon: category.icon,
            });
            return true;
        } catch (error) {
            console.error("Update Error:", error);
            Alert.alert("Error", "Could not update expense.");
            return false;
        }
    };

    // Filter Logic
    const [filter, setFilter] = useState<'1W' | '1M' | '1Y'>('1M');

    const filteredTransactions = transactions.filter(t => {
        if (!t.createdAt) return true;
        const date = t.createdAt.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (filter === '1W') return diffDays <= 7;
        if (filter === '1M') return diffDays <= 30;
        if (filter === '1Y') return diffDays <= 365;
        return true;
    });

    // Helper for Chart Data
    const chartData = {
        labels: filteredTransactions.slice(0, 6).reverse().map(t => t.date.substring(0, 3) || "?"),
        datasets: [{
            data: filteredTransactions.length > 0
                ? filteredTransactions.slice(0, 6).reverse().map(t => parseFloat(t.amount.replace('$', '')))
                : [0, 0, 0, 0, 0, 0]
        }]
    };

    return {
        transactions: filteredTransactions,
        allTransactions: transactions,
        loading,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        chartData,
        filter,
        setFilter
    };
};
