"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ApiResponse, Pen } from "@/types";

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
    withCredentials: true,
});

const EditPage = ({ params }: { params: { id: string } }) => {
    const [pen, setPen] = useState<Pen>({
        id: 0,
        name: "",
        price: 0,
        created_at: "",
        updated_at: "",
    });
    const [nameMessage, setNameMessage] = useState<string>("");
    const [priceMessage, setPriceMessage] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const getPen = async () => {
            try {
                const response = await http.get<ApiResponse<Pen>>(
                    `/api/pens/${params.id}`
                );
                setPen(response.data.data);
            } catch (error) {
                console.error("Error fetching pen:", error);
            }
        };
        getPen();
    }, [params.id]);

    const updatePen = async () => {
        const requestBody = {
            name: pen.name,
            price: pen.price,
        };
        http.patch(`/api/pens/${pen.id}`, requestBody, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => {
                router.push("/pens");
            })
            .catch(function (error: any) {
                if (error.response?.data?.errors) {
                    setNameMessage(error.response.data.errors.name?.[0] || "");
                    setPriceMessage(
                        error.response.data.errors.price?.[0] || ""
                    );
                }
            });
    };

    return (
        <div className="relative p-3">
            <div className="flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                <div className="py-2 px-4">
                    <p>
                        IDが{params.id}
                        のペンの名前と価格を入力して、編集ボタンをクリックしてください
                    </p>
                </div>
                <input
                    type="text"
                    className="my-3 peer py-3 px-4 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    placeholder="名前"
                    value={pen.name || ""}
                    onChange={(e) => {
                        setPen({
                            ...pen,
                            name: e.target.value,
                        });
                    }}
                />
                <div className="ml-4 text-red-500">{nameMessage}</div>
                <input
                    type="text"
                    className="my-3 peer py-3 px-4 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    placeholder="価格"
                    value={pen.price || ""}
                    onChange={(e) => {
                        setPen({
                            ...pen,
                            price: e.target.value,
                        });
                    }}
                />
                <div className="ml-4 text-red-500">{priceMessage}</div>
                <div>
                    <button
                        className="my-3 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={() => {
                            updatePen();
                        }}
                    >
                        編集
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPage;

// 修正のためのダミーコメント
