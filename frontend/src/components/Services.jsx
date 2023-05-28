import { Card } from "flowbite-react";

export default function Services() {
    return(
        <div id="services" className="flex flex-col md:flex-row">
            <Card
            imgAlt="Meaningful alt text for an image that is not purely decorative"
            imgSrc="/logo.svg"
            className="m-4"
            >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <p>
                Noteworthy technology acquisitions 2021
                </p>
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                <p>
                Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                </p>
            </p>
            </Card>
            <Card
            imgAlt="Meaningful alt text for an image that is not purely decorative"
            imgSrc="/logo.svg"
            className="m-4"
            >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <p>
                Noteworthy technology acquisitions 2021
                </p>
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                <p>
                Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                </p>
            </p>
            </Card>
            <Card
            className="m-4"
            imgAlt="Meaningful alt text for an image that is not purely decorative"
            imgSrc="/logo.svg"
            >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <p>
                Noteworthy technology acquisitions 2021
                </p>
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                <p>
                Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                </p>
            </p>
            </Card>
        </div>
    )
}