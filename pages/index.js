import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Login from "./auth/login";
import Auth from "./auth";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <Auth />;
}
