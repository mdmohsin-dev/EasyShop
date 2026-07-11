'use client';

import { Clock, Package, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PaymentsChart from "../PaymentsChart";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface AdminStats {
    totalUsers: number;
    totalProducts: number;
    pendingOrders: number;
}

const AdminDashboard = () => {

    const [stats, setStats] = useState<AdminStats | null>(null);

    useEffect(() => {
        fetch("/api/dashboard/stats")
            .then((res) => res.json())
            .then(setStats);
    }, []);

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-semibold sm:text-3xl">Admin dashboard</h1>
                    <p className="mt-1 text-sm text-muted">An overview of the shop.</p>
                </div>
                <Link href="/dashboard/products/add">
                    <Button variant="accent">
                        <Plus size={16} /> Add product
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center gap-4 pt-5">
                        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Users size={20} />
                        </span>
                        <div>
                            <p className="text-2xl font-semibold font-display">{stats?.totalUsers ?? "—"}</p>
                            <p className="text-sm text-muted">Registered users</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 pt-5">
                        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-accent-foreground">
                            <Package size={20} />
                        </span>
                        <div>
                            <p className="text-2xl font-semibold font-display">{stats?.totalProducts ?? "—"}</p>
                            <p className="text-sm text-muted">Products listed</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 pt-5">
                        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-danger text-danger-foreground">
                            <Clock size={20} />
                        </span>
                        <div>
                            <p className="text-2xl font-semibold font-display">{stats?.pendingOrders ?? "—"}</p>
                            <p className="text-sm text-muted">Pending orders</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-4">
                <PaymentsChart />
            </div>
        </div>
    );
};

export default AdminDashboard;