"use client";
import React, { useEffect, useState } from "react";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { Logout, getMe, userSearch } from "../store/Slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { GoArrowLeft } from "react-icons/go";
import { redirect, usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const Header = () => {
  const dispatch: AppDispatch = useDispatch();

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showsearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState(" ");

  const handleLogout = () => {
    // Show the logout confirmation dialog
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    // Dispatch the logout action when confirmed
    dispatch(Logout());
    // Close the confirmation dialog
    setShowLogoutConfirmation(false);
  };

  const cancelLogout = () => {
    // Close the confirmation dialog without logging out
    setShowLogoutConfirmation(false);
  };

  const { isAuthenticated, userValue, userp, loading } = useSelector(
    (state: any) => state.user
  );

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    dispatch(userSearch(searchValue));
  }, [dispatch, searchValue]);

  const searchHandle = () => {
    setShowSearch(!showsearch);
  };

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const pathname = usePathname();

  return (
    <>
      {isAuthenticated && (
        <div className="flex  justify-between items-center  text-2xl lg:text-3xl px-8 bg-white text-blue700  m-auto h-16 shadow-md lg:justify-around cursor-pointer fixed top-0 w-full ">
          <div className="flex items-center gap-x-7 lg:gap-x-14 bg-white">
            <div className="bg-gray-200 w-10 h-10 flex items-center justify-center rounded-full ">
              <AiOutlineSearch
                size={23}
                className="text-gray-800"
                onClick={searchHandle}
              />
            </div>
            <Link
              href={"/"}
              className={`${pathname === "/" ? "text-blue-700" : "text-black"}`}
            >
              <AiFillHome />
            </Link>
            <Link
              href={"/addfriends"}
              className={`${
                pathname === "/addfriends" ? "text-blue-700" : "text-black"
              }`}
            >
              <FaUserFriends />
            </Link>
            {userp.user?.role === "admin" && (
              <Link
                href={"/admin"}
                className={`${
                  pathname === "/admin" ? "text-blue-700" : "text-black"
                }`}
              >
                <MdDashboardCustomize />
              </Link>
            )}
          </div>

          <div className="flex items-center gap-x-5 lg:gap-x-14 bg-white">
            {isAuthenticated ? (
              <p onClick={handleLogout} className="text-lg">
                Logout
              </p>
            ) : (
              <Link
                href={"/login"}
                className={`text-lg ${
                  pathname === "/login" ? "text-blue-700" : "text-black"
                }`}
              >
                Login
              </Link>
            )}
            <Link
              href={"/profile"}
              className={`${
                pathname === "/profile" ? "text-blue-700" : "text-black"
              }`}
            >
              <CgProfile />
            </Link>
          </div>
        </div>
      )}
      <div
        className={`text-center w-fit fixed top-0 left-0 ${
          showsearch ? " translate-x-0" : "-translate-x-[100vw]"
        } transition-all duration-300 bg-white shadow-xl `}
      >
        <div className="flex items-center gap-x-3 px-3 py-2">
          <GoArrowLeft
            size={20}
            onClick={searchHandle}
            className="cursor-pointer"
          />
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-slate-100 outline-0 rounded-3xl  w-[16rem] px-2 py-1 h-10"
            type="text"
            placeholder="search user....."
          />
        </div>
        <div className="w-[19rem] py-1 mx-auto ">
          {userValue && userValue.length > 0 ? (
            userValue.map((v: any, i: any) => (
              <Link
                key={v._id}
                href={`/userprofile/${v._id}`}
                className="flex items-center mx-16 my-3 p-2 rounded-lg hover:bg-slate-200"
              >
                <Image
                  className="w-8 h-8 rounded-full border-[1px] border-black"
                  src={v.avatar.secure_url}
                  alt="user"
                  width={700}
                  height={700}
                />
                <h1 className="text-sm mx-3">{v.name}</h1>
              </Link>
            ))
          ) : (
            <>
              <p>No users found</p>
            </>
          )}
        </div>
      </div>
      {/* Logout confirmation dialog */}
      {showLogoutConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md">
            <p className="text-lg">Are you sure you want href logout?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={confirmLogout}
                className="bg-blue-500 text-white px-4 py-2 mr-2"
              >
                OK
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-400 text-white px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
