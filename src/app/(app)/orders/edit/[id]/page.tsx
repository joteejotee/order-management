"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ApiResponse, Pen, Customer, Order, OrderEditResponse } from "@/types";

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
    withCredentials: true,
});

const EditPage = ({ params }: { params: { id: string } }) => {
    const [customer_idMessage, setCustomer_idMessage] = useState<string>("");
    const [pen_idMessage, setPen_idMessage] = useState<string>("");
    const [numMessage, setNumMessage] = useState<string>("");

    const [order, setOrder] = useState<Order>({
        id: 0,
        customer_id: 0,
        pen_id: 0,
        num: 0,
        orderday: "",
        shipping: false,
        created_at: "",
        updated_at: "",
        customer: {
            id: 0,
            name: "",
            created_at: "",
            updated_at: "",
        },
        pen: {
            id: 0,
            name: "",
            price: 0,
            created_at: "",
            updated_at: "",
        },
    });

    const [pens, setPens] = useState<Pen[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const router = useRouter();

    const getOrder = async () => {
        try {
            const response = await http.get<ApiResponse<OrderEditResponse>>(
                `/api/orders/${params.id}`
            );
            const { data, pens, customers } = response.data.data;
            setOrder(data);
            setPens(pens);
            setCustomers(customers);
        } catch (error) {
            console.error("Error fetching order:", error);
        }
    };

    useEffect(() => {
        getOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateOrder = async () => {
        const requestBody = {
            customer_id: order.customer_id,
            pen_id: order.pen_id,
            num: order.num,
        };

        console.log(requestBody);

        // この1行下がAPIリクエスト
        http.patch(`/api/orders/${order.id}`, requestBody, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => {
                router.push("/orders");
            })
            .catch(function (error) {
                setCustomer_idMessage(
                    error.response.data.errors.customer_id || ""
                );
                setPen_idMessage(error.response.data.errors.pen_id || "");
                setNumMessage(error.response.data.errors.num || "");
            });
    };

    return (
        <div className="relative p-3">
            <div className="flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                <div className="py-2 px-4">
                    <p>
                        IDが{params.id}
                        の注文の顧客とペン、注文数を入力して、登録ボタンをクリックしてください
                    </p>
                </div>
                <select
                    id="customerSelect"
                    value={order.customer_id}
                    onChange={(e) => {
                        setOrder({
                            ...order,
                            customer_id: Number(e.target.value),
                        });
                    }}
                    className="my-3 py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600"
                >
                    <option value="">顧客を選択してください</option>
                    {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                            {customer.name}
                        </option>
                    ))}
                </select>
                <div className="ml-4 text-red-500">{customer_idMessage}</div>
                <select
                    id="penSelect"
                    value={order.pen_id}
                    onChange={(e) => {
                        setOrder({
                            ...order,
                            pen_id: Number(e.target.value),
                        });
                    }}
                    className="my-3 py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600"
                >
                    <option value="">ペンを選択してください</option>
                    {pens.map((pen) => (
                        <option key={pen.id} value={pen.id}>
                            {pen.name}
                        </option>
                    ))}
                </select>
                <div className="ml-4 text-red-500">{pen_idMessage}</div>
                <input
                    type="text"
                    className="my-3 peer py-3 px-4 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    placeholder="数量"
                    value={order.num}
                    onChange={(e) => {
                        setOrder({
                            ...order,
                            num: Number(e.target.value),
                        });
                    }}
                />
                <div className="ml-4 text-red-500">{numMessage}</div>
                <div>
                    <button
                        className="my-3 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={() => {
                            updateOrder();
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
