import { fruit, twod } from "./types";
import { RADIUS } from "./ProblemStore";

const getNorm = (v: twod) => {
  return Math.sqrt(v.x * v.x + v.y * v.y);
};
const getVectorCal = (v1: twod, v2: twod, cal: string): twod => {
  if (cal === "-") {
    return {
      x: v1.x - v2.x,
      y: v1.y - v2.y,
    };
  } else if (cal === "+") {
    return {
      x: v1.x + v2.x,
      y: v1.y + v2.y,
    };
  } else return v1;
};

const nearby = (fruit1: fruit, fruit2: fruit) => {
  const dist = fruit1.radius + fruit2.radius;
  if (
    Math.abs(fruit1.pos.x - fruit1.pos.x) > dist + 1 ||
    Math.abs(fruit1.pos.y - fruit1.pos.y) > dist + 1
  ) {
    return false;
  }
  return getNorm(getVectorCal(fruit1.pos, fruit2.pos, "-")) <= dist;
};
export const circleCollision = (
  fruit1: fruit,
  fruit2: fruit,
  colPower: number,
  colRate: number
): {
  fruit1: fruit;
  fruit2: fruit | undefined;
} => {
  // 부딪히지 않은 과일들 패스
  if (!nearby(fruit1, fruit2)) {
    return {
      fruit1: fruit1,
      fruit2: fruit2,
    };
  } else {
    // 만약 같은 종류의 과일일 경우 중점에 새 과일
    if (fruit1.radius === fruit2.radius) {
      // 일정 크기 이상일 경우 가장 작은 크기로 회귀
      if (fruit1.radius > 28.9 * RADIUS) {
        return {
          fruit1: {
            ...fruit1,
            pos: {
              x: (fruit1.pos.x + fruit2.pos.x) / 2,
              y: (fruit1.pos.y + fruit2.pos.y) / 2,
            },
            radius: 6,
            fillIndex: 0,
          },
          fruit2: undefined,
        };
      } else {
        // 기본적으로 1.4배 지름 확장 (루트2 유사치)
        return {
          fruit1: {
            ...fruit1,
            pos: {
              x: (fruit1.pos.x + fruit2.pos.x) / 2,
              y: (fruit1.pos.y + fruit2.pos.y) / 2,
            },
            radius: fruit1.radius * 1.4,
            fillIndex: fruit1.fillIndex + 1,
          },
          fruit2: undefined,
        };
      }
    }

    const fruit12 = getVectorCal(fruit1.pos, fruit2.pos, "-");
    const fruit21 = getVectorCal(fruit2.pos, fruit1.pos, "-");

    // 두 물체 속도차
    const v21 = getVectorCal(fruit1.velocity, fruit2.velocity, "-");

    // 두 물체가 떨어져야하는 거리
    const dist = fruit1.radius + fruit2.radius + 1;

    // 두 물체 사이의 현재 거리
    const nowDist = getNorm(fruit12);

    // 충돌 시 적용하는 힘의 크기는 두 물체 속도차의 norm에 비례하도록
    const collisionPower = colPower * getNorm(v21);

    // 충돌 시 손실되는 에너지 임의로 적용
    const collisionRate = colRate;

    // 새로운 속도
    // 부딪힌 방향에 반대되는 방향으로 위에서 계산한 힘에 비례, 질량에 반비례하게 속도 적용 후
    // 에너지 손실을 구현하기 위해 일정 비율 크기 감소
    const newVelo1 = {
      x: (fruit1.velocity.x + collisionPower * fruit12.x) * collisionRate,
      y: (fruit1.velocity.y + collisionPower * fruit12.y) * collisionRate,
    };
    const newVelo2 = {
      x: (fruit2.velocity.x + collisionPower * fruit21.x) * collisionRate,
      y: (fruit2.velocity.y + collisionPower * fruit21.y) * collisionRate,
    };

    // 부딪힌 과일들의 반지름 합만큼 거리를 벌려주고 위에서 계산한 속도 적용
    return {
      fruit1: {
        ...fruit1,
        velocity: newVelo1,
      },
      fruit2: {
        ...fruit2,
        pos: {
          x: fruit1.pos.x + fruit21.x * (dist / nowDist),
          y: fruit1.pos.y + fruit21.y * (dist / nowDist),
        },
        velocity: newVelo2,
      },
    };
  }
};
