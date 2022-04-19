import { useEffect, useState, useCallback, useMemo } from "react";
import styles from "../../styles/Snake.module.css";
import { Config, CellType, Direction } from "../constants";
import { getDefaultSnake, getRandomCell } from "../helper";
import Cell from "../components/Cell";
import { useInterval } from "../useInterval";

const useSnake = () => {
  // const grid = useRef();

  // snake[0] is head and snake[snake.length - 1] is tail
  const [snake, setSnake] = useState(getDefaultSnake());
  const [direction, setDirection] = useState(Direction.Right);

  const [objects, setObjects] = useState([
    { x: 4, y: 10, createTime: Date.now(), type: "food" },

    { x: 4, y: 10, createTime: Date.now(), type: "poison" },
  ]);
  //   const [poisons, setPoisons] = useState([
  //     { x: 5, y: -10, createTime: Date.now() },
  //   ]);
  const isObject = useCallback(
    ({ x, y }) => objects.find((object) => object.x === x && object.y === y),
    [objects]
  );
  const isObjectOfType = useCallback(
    ({ x, y, type }) => {
      const object = isObject({ x, y });
      return object && object.type === type;
    },
    [isObject]
  );

  const score = snake.length - 3;

  // console.log("snake", snake);

  const resetGame = useCallback(() => {
    setSnake(getDefaultSnake());
    setDirection(Direction.Right);
  }, []);
  // usecallback prevent initialization of  function on each re- render
  const addNewObject = useCallback(
    (type) => {
      let newObject = getRandomCell();
      while (isSnake(newObject) || isObject(newObject)) {
        newObject = getRandomCell();
      }

      newObject.type = type;

      setObjects((CurrentObjects) => [...CurrentObjects, newObject]);
      //  spread will hold all existing food then add current new food
    },
    [isObject, isSnake]
  );

  //   const addPoison = useCallback(() => {
  //     let newPoison = getRandomCell();
  //     while (isSnake(newPoison) || isPoison(newPoison)) {
  //       newPoison = getRandomCell();
  //     }

  //     setPoisons((CurrentPoisons) => [...CurrentPoisons, newPoison]);
  //   }, [isPoison, isSnake]);

  //   const isPoison = useCallback(
  //     ({ x, y }) => poisons.some((poison) => poison.x === x && poison.y === y),
  //     [poisons]
  //   );

  const isSnake = useCallback(
    ({ x, y }) =>
      snake.find((position) => position.x === x && position.y === y),
    [snake]
  );

  const removeObject = useCallback((type) => {
    setObjects((CurrentObjects) =>
      CurrentObjects.filter(
        (object) =>
          object.type !== type ||
          Math.floor(Date.now() - object.createTime <= 10 * 1000)
      )
    );
  }, []);
  //   const removePoison = useCallback(() => {
  //     setPoisons((CurrentPoisons) =>
  //       CurrentPoisons.filter((poison) =>
  //         Math.floor(Date.now() - poison.createTime <= 5 * 1000)
  //       )
  //     );
  //   }, []);

  // move the snake

  const runSingleStep = useCallback(() => {
    setSnake((snake) => {
      const head = snake[0];
      const newHead = {
        x: (head.x + direction.x + Config.width) % Config.width,
        y: (head.y + direction.y + Config.height) % Config.height,
      };

      // make a new snake by extending head
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      const newSnake = [newHead, ...snake];

      // remove tail when head is not in the food
      if (!isObjectOfType({ x: newHead.x, y: newHead.y, type: "food" })) {
        newSnake.pop();
      } else {
        setObjects((currentObject) =>
          currentObject.filter(
            (object) => !(object.x === newHead.x && object.y === newHead.y)
          )
        );
      }
      //   if (isPoison(newHead)) {
      //     setPoisons((CurrentPoisons) =>
      //       CurrentPoisons.filter(
      //         (poison) => !(poison.x === newHead.x && poison.y === newHead.y)
      //       )
      //     );
      //   }

      //  let gameHasBeenReset = false;
      //   foods.forEach(
      //     // (food) => !(food.x == newHead.x && food.y === newHead.y)
      //     (food) => {
      //       if (gameHasBeenReset) {
      //         return;
      //       }
      //       if (
      //         food.x == newHead.x &&
      //         food.y === newHead.y &&
      //         food.type === "badFood"
      //       ) {
      //         gameHasBeenReset = true;
      //         resetGame();
      //       }
      //     }
      //     // it will remove that food which is matched with the position of snake
      //   );
      //   if (gameHasBeenReset) {
      //     return;
      //   }
      // it will remove that food which is matched with the position of snake
      if (isObjectOfType({ x: newHead.x, y: newHead.y, type: "poison" })) {
        resetGame();
      }

      if (isSnake(newHead)) {
        resetGame();
      }

      return newSnake;
    });

    // const timer = setInterval(runSingleStep, 1000);

    // return () => clearInterval(timer);
  }, [isObjectOfType, direction.x, direction.y, isSnake, resetGame]);

  useEffect(() => {
    const head = snake[0];
    if (isObject(head)) {
      // setScore((score) => {
      //   return score + 1;
      // });

      addNewObject("food");
    }
    //   let newFood = getRandomCell();
    //   while (isSnake(newFood)) {
    //     newFood = getRandomCell();
    //   }
    //   setFoods(newFood)
    // }
  }, [addNewObject, isObject, snake]);
  // difference between setinerval and set timeout ....and  array.find and some

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     addNewFood();
  //   }, 3 * 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [addNewFood]);

  // useEffect(() => {
  //   const disappearFood = setInterval(() => {
  //     removeEachFood();
  //   }, 1000);
  //   return () => clearInterval(disappearFood);
  // }, []);

  useInterval(() => addNewObject("food"), 3 * 1000);
  useInterval(() => removeObject("food"), 100);
  useInterval(() => addNewObject("poison"), 5 * 1000);
  useInterval(() => removeObject("poison"), 200);
  useInterval(runSingleStep, 100);
  //   useInterval(addNewObject(CellType.BadFood), 3 * 1000);
  //   useInterval(removeObject(CellType.BadFood), 100);

  useEffect(() => {
    const handleDirection = (direction, oppositeDirection) => {
      setDirection((currentDirection) => {
        if (currentDirection !== oppositeDirection) {
          return direction;
        }
        return currentDirection;
      });
    };
    const handleNavigation = (event) => {
      switch (event.key) {
        case "ArrowUp":
          handleDirection(Direction.Top, Direction.Bottom);
          break;

        case "ArrowDown":
          handleDirection(Direction.Bottom, Direction.Top);
          break;

        case "ArrowLeft":
          handleDirection(Direction.Left, Direction.Right);
          break;

        case "ArrowRight":
          handleDirection(Direction.Right, Direction.Left);
          break;
      }
    };
    window.addEventListener("keydown", handleNavigation);

    return () => window.removeEventListener("keydown", handleNavigation);
  }, []);
  // if (isPoison(newHead)) {
  //   setPoisons((CurrentPoisons) =>
  //     CurrentPoisons.filter(
  //       (poisons) => !(poison.x === newHead.x && poison.y === newHead.y)
  //     )
  //   );
  // }

  // ?. is called optional chaining
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  // const isFood = ({ x, y }) => foods.some((food)=>food.x === x && food.y === y);
  // console.log(isFood)
  // const isSnake = ({ x, y }) =>
  // snake.find((position) => position.x === x && position.y === y);
  //  console.log(isSnake,snake)
  // return { score, isSnake, isFood, isPoison };

  // update score whenever head touches a food

  // const Snake = () => {
  // const { score, isSnake, isFood, isPoison } = useSnake();

  const cells = useMemo(() => {
    const elements = [];
    for (let x = 0; x < Config.width; x++) {
      for (let y = 0; y < Config.height; y++) {
        let type = CellType.Empty,
          remaining = undefined;
        if (isObjectOfType({ x, y, type: "food" })) {
          type = CellType.GoodFood;
          remaining =
            10 -
            Math.round(
              (Date.now() -
                objects.find((object) => object.x === x && object.y === y)
                  .createTime) /
                1000
            );
        }
        if (isObjectOfType({ x, y, type: "poison" })) {
          type = CellType.BadFood;
          remaining =
            10 -
            Math.round(
              (Date.now() -
                objects.find((object) => object.x === x && object.y === y)
                  .createTime) /
                1000
            );
        } else if (isSnake({ x, y })) {
          type = CellType.Snake;
        }
        elements.push(
          <Cell
            key={`${x}-${y}`}
            x={x}
            y={y}
            type={type}
            remaining={remaining}
          />
        );
      }
    }
    return elements;
  }, [objects, isObject, isSnake]);
  return {
    snake,
    score,
    cells,
  };
};

// const Snake =() =>{const{score,isSnake,isFood}= useSnake()
const Snake = () => {
  const { score, cells } = useSnake();

  return (
    <div className={styles.container}>
      <div
        className={styles.header}
        style={{ width: Config.width * Config.cellSize }}
      >
        Score: {score}
      </div>
      <div
        className={styles.grid}
        style={{
          height: Config.height * Config.cellSize,
          width: Config.width * Config.cellSize,
        }}
      >
        {cells}
      </div>
    </div>
  );
};
export default Snake;
