"use client";
import React, { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

interface CreatePenFormData {
    name: string;
    price: string;
    stock: string;
}

const CreatePen = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<CreatePenFormData>({
        name: "",
        price: "",
        stock: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await axios.post(`${backendUrl}/api/pens`, {
                name: formData.name,
                price: parseInt(formData.price),
                stock: parseInt(formData.stock),
            });
            router.push("/pens");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("予期せぬエラーが発生しました");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">ペンの新規作成</h1>
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        名前
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                    >
                        価格
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="stock"
                        className="block text-sm font-medium text-gray-700"
                    >
                        在庫数
                    </label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push("/pens")}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isLoading ? "作成中..." : "作成"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePen;
