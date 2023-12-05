"use client";
import React, { useEffect, useMemo, useCallback } from "react";
import { Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
} from "chart.js";
import { deleteUser, postsData, usersData } from "@/store/Slices/adminSlice";
import { AppDispatch } from "@/store/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend
);

const Admin = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, posts } = useSelector((state: any) => state.admin);

  useEffect(() => {
     dispatch(usersData());
     dispatch(postsData());
  }, [dispatch]);

  const chartData = useMemo(
    () => ({
      labels: ["posts", "users"],
      datasets: [
        {
          label: "Products by Category",
          data: posts ? [posts.length, users.length] : [0, 0],
          backgroundColor: ["#F87171", "#60A5FA"],
          borderColor: ["rgb(159,63,176)", "rgb(78,63,176)"],
          borderWidth: 1,
        },
      ],
    }),
    [posts, users]
  );

  const handleDelete = useCallback(
    async (userId: string) => {
      await dispatch(deleteUser(userId));
      await dispatch(usersData());
      await dispatch(postsData());
    },
    [dispatch]
  );

  return (
    <>
      <div className="w-[80vw] h-[80vh] flex justify-center items-center mx-auto my-28 ">
        <Doughnut data={chartData} />
      </div>
      <div className="overflow-x-auto scrollb">
        <table className="min-w-full bg-white table-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center">Name</th>
              <th className="py-2 px-4 border-b text-center">Email</th>
              <th className="py-2 px-4 border-b text-center">Posts</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {useMemo(
              () =>
                users.map((user: any) => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b text-center">
                      {user.name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {user.email}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {user.posts?.length}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )),
              [users, handleDelete]
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Admin;
