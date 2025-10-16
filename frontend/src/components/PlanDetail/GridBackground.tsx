interface GridBackgroundProps {
    cellSize?: number;
    largeGridSize?: number;
    lineColor?: string;
    lineWidth?: number;
    largeLineWidth?: number;
}

const GridBackground: React.FC<GridBackgroundProps> = ({
    cellSize = 30, // Reduced default cell size
    largeGridSize = 200, // Size for the larger grid squares
    lineColor = "rgba(0, 0, 0, 0.1)",
    lineWidth = 0.5,
    largeLineWidth = 2, // Thicker lines for the larger grid
}) => {
    return (
        <div
            id="grid-background"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                backgroundSize: `${largeGridSize}px ${largeGridSize}px, ${cellSize}px ${cellSize}px`,
                zIndex: 0,
                backgroundImage: `
          linear-gradient(to right, ${lineColor} ${largeLineWidth}px, transparent ${largeLineWidth}px),
          linear-gradient(to bottom, ${lineColor} ${largeLineWidth}px, transparent ${largeLineWidth}px),
          linear-gradient(to right, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px),
          linear-gradient(to bottom, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px)
        `,
                backgroundPosition: `0 0, 0 0, 0 0, 0 0`,
                pointerEvents: "none",
                opacity: 0.6, // Increased opacity to ensure visibility
                visibility: "visible",
            }}
        />
    );
};

export default GridBackground;
