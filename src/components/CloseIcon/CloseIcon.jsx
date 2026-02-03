import React from "react";

const CloseIcon = ({
    color = '#3D220D',
    size = 24,
    className = "close__icon"
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M32,0C14.327,0,0,14.327,0,32s14.327,32,32,32s32-14.327,32-32S49.673,0,32,0z M32,62.001C15.432,62.001,2,48.568,2,32 C2,15.432,15.432,2,32,2c16.568,0,30,13.432,30,30C62,48.568,48.568,62.001,32,62.001z"
                fill={color}
            />

            <polygon
                fillRule="evenodd"
                clipRule="evenodd"
                points="41.191,24.222 39.777,22.808 32,30.586 24.222,22.808 22.808,24.222 30.586,32 22.808,39.777 24.222,41.191 32,33.414 39.777,41.191 41.191,39.777 33.414,32"
                fill={color}
            />
        </svg>
    )
}

export default CloseIcon;
