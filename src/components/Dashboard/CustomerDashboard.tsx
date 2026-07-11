'use client';

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Clock, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface CustomerStats {
    totalPurchased: number;
    pendingOrders: number;
}

const CustomerDashboard = () => {

    const { data: session } = useSession();
    const [stats, setStats] = useState<CustomerStats | null>(null);

    useEffect(() => {
        fetch("/api/dashboard/customer-stats")
            .then((res) => res.json())
            .then(setStats);
    }, []);

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">Welcome, {session?.user.name}</h1>
            <p className="mt-1 text-sm text-muted">Here&apos;s a quick look at your account.</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="flex items-center gap-4 pt-5">
                        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <ShoppingBag size={20} />
                        </span>
                        <div>
                            <p className="text-2xl font-semibold font-display">{stats?.totalPurchased ?? "—"}</p>
                            <p className="text-sm text-muted">Products purchased</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 pt-5">
                        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-accent-foreground">
                            <Clock size={20} />
                        </span>
                        <div>
                            <p className="text-2xl font-semibold font-display">{stats?.pendingOrders ?? "—"}</p>
                            <p className="text-sm text-muted">Pending orders</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 flex gap-3">
                <Link href="/dashboard/orders">
                    <Button variant="outline">View my orders</Button>
                </Link>
                <Link href="/shop">
                    <Button>Browse the shop</Button>
                </Link>
            </div>
        </div>
    );
};

export default CustomerDashboard;