import Image from "next/image";
import Link from "next/link";

/**
 * 
 * 
 * @returns the rendered Header Component
 */
export default function Header() {
    return (
        <div className="shadow sticky-top p-2 mb-2 bg-danger">
            <div className="d-flex align-items-center">
                <Link href="/">
                    <Image src={'/img/logo.png'} alt="logo" width={100} height={75} className="object-fit-contain"></Image>
                    
                </Link>
                <h1 className="text-white">Contact-Log</h1>
            </div>
        </div>
    )
}
