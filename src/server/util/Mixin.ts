// priority: 10000

type Constructor<T = {}> = new (...args: any[]) => T;
type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;

function Mix<TBase extends Constructor>(Base: TBase) {
	return {
		with<T1 extends Constructor>(
			m1: (b: TBase) => T1
		): {
			with<T2 extends Constructor>(
				m2: (b: T1) => T2
			): { done(): T2; };
		} {
			return {
				with<T2 extends Constructor>(m2: (b: T1) => T2) {
					return {
						done() {
							return m2(m1(Base));
						}
					};
				}
			};
		}
	};
}

function CanFly<TBase extends Constructor>(Base: TBase) {
	return class extends Base {
		public fly(): this {
			console.log("flap flap");
			return this;
		}
	};
}

function CanWalk<TBase extends Constructor>(Base: TBase) {
	return class extends Base {
		public walk(): this {
			console.log("walk walk");
			return this;
		}
	};
}

class Animal { }
const BaseBird = Mix(Animal)
	.with(CanWalk)
	.with(CanFly)
	.done();

class Bird extends BaseBird { }

const birdy = new Bird();