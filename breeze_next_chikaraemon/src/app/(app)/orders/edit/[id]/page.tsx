"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Order, Pen } from "@/types";

interface EditOrderProps {
    params: {
        id: string;
    };
}

const EditOrder = ({ params }: EditOrderProps) => {
    const router = useRouter();
    const [pens, setPens] = useState<Pen[]>([]);
    const [selectedPen, setSelectedPen] = useState("");
    const [quantity, setQuantity] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orderResponse, pensResponse] = await Promise.all([
                    axios.get<{ data: Order }>(`${backendUrl}/api/orders/${params.id}`),
                    axios.get<{ data: { data: Pen[] } }>(`${backendUrl}/api/pens`),
                ]);

                const order = orderResponse.data.data;
                setSelectedPen(order.pen_id.toString());
                setQuantity(order.quantity.toString());
                setPens(pensResponse.data.data.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [params.id]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.put(`${backendUrl}/api/orders/${params.id}`, {
                pen_id: parseInt(selectedPen),
                quantity: parseInt(quantity),
            });
            router.push("/orders");
        } catch (error) {
            console.error("Failed to update order:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePenChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedPen(e.target.value);
    };

    const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuantity(e.target.value);
    };

    if (isFetching) {
        return <div>読み込み中...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="pen"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    ペン
                </label>
                <select
                    id="pen"
                    value={selectedPen}
                    onChange={handlePenChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                >
                    <option value="">選択してください</option>
                    {pens.map((pen) => (
                        <option key={pen.id} value={pen.id}>
                            {pen.name} - {pen.price}円
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    数量
                </label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                    min="1"
                />
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => router.push("/orders")}
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

export default EditOrder;
