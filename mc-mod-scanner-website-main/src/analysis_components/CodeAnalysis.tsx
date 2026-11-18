import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {LoadingCircle} from "./LoadingCircle";

export interface Warnings {
    type: string;
    info: string;
}

export interface FileWarnings {
    classPath: string;
    warnings: Warnings[];
}

const CodeAnalysis: React.FC = () => {

    const [fileWarnings, setFileWarnings] = useState<FileWarnings[] | null>(null);
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            console.log(location.pathname)
            try {
                const apiURL= process.env.MCMODSCANNER_API_URL || 'https://mcmodscanner.online/api';
                const response = await fetch(apiURL + location.pathname + "/analysis"); // Replace with your actual API endpoint
                const data = await response.json();
                setFileWarnings(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData().then(r => {});
    }, [location.pathname]);

    return (
        <div>
            {fileWarnings ? (
                (fileWarnings.length !== 0 ? (
                    fileWarnings.map((item, index) => (
                        <div
                            key={index}
                            className={`p-4 w-full ${
                                index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'
                            }`}
                        >
                            <h2 className="text-sm font-bold">{item.classPath}</h2>
                            <ul>
                                {item.warnings.map((warning, index) => (
                                    <li key={index}>
                                        {warning.type}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center h-screen">
                        <h1 className="pt-20 text-xl">No code warnings found.</h1>
                    </div>
                ))
            ) : (
                <LoadingCircle />
            )}
        </div>
    )
}

export {CodeAnalysis};
