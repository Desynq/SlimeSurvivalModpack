// priority: 1000

interface SkillData {
	title: string;
	rewards: object[];
	description: any[];
	cost: integer;
	icon?: any;
	frame?: any;
	required_points?: integer;
	required_spent_points?: integer;
	required_skills?: integer;
	size?: float;
}

class SkillDefinition {
	private categoryId: string;
	private definitionId: string;
	private data: SkillData;
	private isRoot?: boolean;

	public constructor(categoryId: string, definitionId: string) {
		this.categoryId = categoryId;
		this.definitionId = definitionId;
		this.data = {
			title: SkillDefinition.convertIdToTitle(definitionId),
			rewards: [],
			description: [""],
			cost: 0
		};
	}

	/* --------------------------------- Static --------------------------------- */

	private static convertIdToTitle(id: string): string {
		const parts = id.split("_");
		const maybePart: string = parts[parts.length - 1];
		const numberPart = !isNaN(Number(maybePart))
			? parts.pop()
			: undefined;

		const name = parts.map(capitalize).join(" ");

		return numberPart
			? `${name} ${toRoman(parseInt(numberPart, 10))}`
			: name;
	}

	/* ---------------------------- Instance Methods ---------------------------- */

	public copy(definitionId: string): SkillDefinition {
		const copy = new SkillDefinition(this.categoryId, definitionId);
		copy.data = this.data;
		copy.data.title = SkillDefinition.convertIdToTitle(definitionId);
		return copy;
	}

	public serialize(json: any): this {
		json[this.definitionId] = this.data;
		return this;
	}

	public toSkill(skillId: string): Skill {
		const skill = new Skill(this.categoryId, skillId, this.isRoot ?? false);
		return skill;
	}

	public findSkill(): Skill {
		const category = this.categoryId.split(":")[1];
		const json = JsonIO.read(
			`kubejs/data/slimesurvival/puffish_skills/categories/${category}/skills.json`
		);
		const match = Object.entries(json).find(
			([, v]: [string, any]) => v.definition === this.definitionId
		);
		if (match) {
			const [id] = match;
			return this.toSkill(id);
		} else {
			console.warn(
				`Could not find skill for definition: ${this.definitionId} in category: ${this.categoryId}`
			);
			return this.toSkill("");
		}
	}

	public serializeIntoSkill(json: any): Skill {
		return this.serialize(json).findSkill();
	}

	public title(title: string): this {
		this.data.title = title;
		return this;
	}

	public itemIcon(itemId: string): this {
		this.data.icon = { type: "item", data: { item: itemId } };
		return this;
	}

	public effectIcon(effectId: string): this {
		this.data.icon = { type: "effect", data: { effect: effectId } };
		return this;
	}

	public advancementFrame(frameType: "task" | "goal" | "challenge"): this {
		this.data.frame = { type: "advancement", data: { frame: frameType } };
		return this;
	}

	public size(size: float): this {
		this.data.size = size;
		return this;
	}

	/**
	 * Skill becomes unlocked by default depending on skill category implementation.
	 * 
	 * Changes advancement frame to `goal`.
	 * 
	 * Changes skill to require `2**31-1` points.
	 */
	public rootSkill(): this {
		this.advancementFrame("goal");
		this.data.required_points = 2147483647;
		this.isRoot = true;
		this.addDescription({ color: "gold", text: "\n\n[Root Skill]" });
		return this;
	}

	public cost(cost: number): this {
		this.isRoot = false;
		this.data.cost = cost;
		this.addDescription({
			color: "dark_green",
			text: `\n\n[Cost: ${cost} point${cost === 1 ? "" : "s"}]`
		});
		return this;
	}

	/**
	 * Sets the amount of parent skills needed to be unlocked in order to be able to unlock this skill
	 */
	public requiredSkills(amount: number): this {
		this.data.required_skills = amount;
		this.addDescription({
			color: "red",
			text: `\n[Parent Skills Needed: ${amount}]`
		});
		return this;
	}

	/**
	 * How many points the player needs in order to be able to unlock the skill.
	 * 
	 * Separate from the skill's point cost.
	 * Overridden by {@link rootSkill}.
	 */
	public requiredSpentPoints(amount: number): this {
		this.data.required_spent_points = amount;
		this.addDescription({ color: "red", text: `\n[Points Spent Needed: ${amount}]` });
		return this;
	}

	public flagPlanned(): this {
		this.addDescription({ color: "yellow", text: "\n[Planned]" });
		return this;
	}

	public addDescription(description: any): this {
		this.data.description.push(description);
		return this;
	}

	public addKeybindDescription(key: string): this {
		this.data.description.push([
			{ color: "gray", text: " [" },
			{ color: "yellow", keybind: key },
			{ color: "gray", text: "] " }
		]);
		return this;
	}

	public resetDescription(): this {
		this.data.description.length = 0;
		return this;
	}

	public addTagReward(tag: string): this {
		this.data.rewards.push({
			type: "puffish_skills:tag",
			data: { tag }
		});
		return this;
	}

	public addAttributeReward(
		attribute: string,
		value: number,
		operation: "multiply_total" | "multiply_base" | "addition"
	): this {
		this.data.rewards.push({
			type: "puffish_skills:attribute",
			data: { attribute, value, operation }
		});
		return this;
	}
}
