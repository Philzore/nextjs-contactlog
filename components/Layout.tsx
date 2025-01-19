import { ReactNode } from "react";
import Head from "next/head";
import Header from "./Header";

/**
 * props for layout component
 * 
 */
interface LayoutProps {
  children: ReactNode; // Der Typ für children wird hier festgelegt
}

/**
 * 
 * @param {LayoutProps} props - The component's props.
 * @param {ReactNode} props.children - The content to be displayed within the layout, typically other components or elements.
 * @returns {JSX.Element} The rendered Layout component.
 */
export default function Layout({ children }:LayoutProps) {
  return (
    <>
       <Head>
        <title>Contact-Log</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <main className="container">{children}</main>
    </>
  )
}
