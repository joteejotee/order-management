"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Pen } from "@/types";

interface EditPenProps {
    params: {
        id: string;
    };
}

const EditPen = ({ params }: EditPenProps) => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchPen = async () => {
            try {
                const response = await axios.get<{ data: Pen }>(
                    `/api/pens/${params.id}`
                );
                const pen = response.data.data;
                setName(pen.name);
                setPrice(pen.price.toString());
            } catch (error) {
                console.error("Failed to fetch pen:", error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchPen();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.put(`/api/pens/${params.id}`, {
                name,
                price: parseInt(price),
            });
            router.push("/pens");
        } catch (error) {
            console.error("Failed to update pen:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div>読み込み中...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    名前
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                />
            </div>
            <div>
                <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    価格
                </label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                />
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => router.push("/pens")}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "保存中..." : "保存"}
                </button>
            </div>
        </form>
    );
};

export default EditPen;
