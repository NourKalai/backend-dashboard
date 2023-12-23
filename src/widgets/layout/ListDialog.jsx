import { useState } from "react";
import { Dialog, DialogHeader, DialogBody, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import path from "path-browserify";

/**
 * @param {string} header - header of the dialog
 * @param {function} handler - function to close the dialog
 * @param {boolean} open - boolean to open the dialog
 * @param {array} data - array of data to be displayed
 * @param {array} listItemTitle - array of the elements of the item that will be displayed in the link
 * @param {string} linkPath - path to the link
 * @param {string} id - id of the item
 */

export default function ListDialog({header, handler, open, data, listItemTitle, linkPath, id="_id"}) {
    return(
        <Dialog size="lg" open={open!==null && open !== false} handler={handler} className="p-4 max-h-[80vh] overflow-auto">
            <DialogHeader>
                <div className="flex"><Typography variant="h4">{header}</Typography></div>
            </DialogHeader>
            <DialogBody className="px-8">
                <ul className="flex flex-col gap-2">
                    {data.map((item, index) => (
                        <li key={index} className="flex flex-row justify-between items-center">
                            <Link to={path.join(linkPath, item[id])} className="focus-visible:outline-none">
                                <Typography variant="h6" className="text-blue-500 font-thin underline underline-offset-2">{listItemTitle.reduce((acc, el) => {return acc + " " + item[el]}, "")}</Typography>
                            </Link>
                        </li>
                    ))}
                </ul>
            </DialogBody>
        </Dialog>
    )
}

