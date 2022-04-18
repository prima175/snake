import { CellType, Config } from "../constants";
import styles from "../../styles/Snake.module.css";
const Cell = ({ x, y, type, remaining }) => {
  const getStyles = () => {
    switch (type) {
      case CellType.Snake:
        return {
          backgroundColor: "#00FF00	",
          borderRadius: 8,
          padding: 2,
        };

      case CellType.GoodFood:
        return {
          backgroundColor: "#FF4500	",
          borderRadius: 20,
          width: 32,
          height: 32,
          transform: `scale(${0.5 + remaining / 20})`,
        };
      case CellType.BadFood:
        return {
          backgroundColor: "darkred",
          borderRadius: 20,
          width: 32,
          height: 32,
          transform: `scale(${0.5 + remaining / 20})`,
        };

      default:
        return {};
    }
  };
  return (
    <div
      key={`${x}-${y}`}
      className={styles.cellContainer}
      style={{
        left: x * Config.cellSize,
        top: y * Config.cellSize,
        width: Config.cellSize,
        height: Config.cellSize,
      }}
    >
      <div className={styles.cell} style={getStyles()}>
        {remaining}
      </div>
    </div>
  );
};
export default Cell;
