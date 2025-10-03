// priority: 1000
/**
 * @param {string} categoryId
 * @param {string} definitionId 
 */
function SkillDefinition(categoryId, definitionId) {
	this._categoryId = categoryId;
	this._definitionId = definitionId;
	this._data = {
		title: SkillDefinition.convertIdToTitle(definitionId),
		/** @type {object[]} */
		rewards: [],
		/** @type {object[]} */
		description: [],
		cost: 0
	};
}


/**
 * @param {string} id 
 */
SkillDefinition.convertIdToTitle = function(id) {
	const parts = id.split("_");
	let numberPart = null;

	// check if last part is a number
	if (!isNaN(Number(parts[parts.length - 1]))) {
		numberPart = parts.pop(); // remove it
	}

	// capitalize each word
	const name = parts.map(capitalize).join(" ");

	// put it all together
	return numberPart ? `${name} ${toRoman(parseInt(numberPart, 10))}` : name;
}

/**
 * Copies the SkillDefinition and all of its data.
 * You must provide a new definitionId so it can be serialized differently.
 * @returns 
 */
SkillDefinition.prototype.copy = function(definitionId) {
	let copy = new SkillDefinition(this._categoryId, definitionId);
	copy._data = this._data;
	copy._data.title = SkillDefinition.convertIdToTitle(definitionId);
	return copy;
}

/**
 * @param {*} json 
 * @returns 
 */
SkillDefinition.prototype.serialize = function(json) {
	json[this._definitionId] = this._data;
	return this;
}

/**
 * 
 * @param {string} skillId 
 */
SkillDefinition.prototype.toSkill = function(skillId) {
	const skill = new Skill(this._categoryId, skillId, this.isRoot == true);
	return skill;
}

/**
 * Finds the first skill to match the definition id or returns a skill with no skill id
 * @returns {Skill}
 */
SkillDefinition.prototype.findSkill = function() {
	const category = this._categoryId.split(":")[1];
	const json = JsonIO.read(`kubejs/data/slimesurvival/puffish_skills/categories/${category}/skills.json`);
	const match = Object.entries(json)
		.find(([k, v]) => v.definition === this._definitionId);
	if (match) {
		const [id, obj] = match;
		return this.toSkill(id);
	}
	else {
		console.warn(`Could not find skill for definition: ${this._definitionId} in category: ${this._categoryId}`);
		return this.toSkill("");
	}
}

/**
 * Serializes the skill definition.
 * @param {*} json
 * @returns {Skill} The first skill it finds in `skills.json` with a matching definition id or a skill with no skill id.
 */
SkillDefinition.prototype.serializeIntoSkill = function(json) {
	return this.serialize(json).findSkill();
}

SkillDefinition.prototype.title = function(title) {
	this._data.title = title;
	return this;
}

/**
 * @param {string} itemId
 */
SkillDefinition.prototype.itemIcon = function(itemId) {
	this._data.icon = {
		type: "item",
		data: {
			item: itemId
		}
	}
	return this;
}

/**
 * @param {string} effectId
 */
SkillDefinition.prototype.effectIcon = function(effectId) {
	this._data.icon = {
		type: "effect",
		data: {
			effect: effectId
		}
	}
	return this;
}

/**
 * 
 * @param {"task" | "goal" | "challenge"} frameType 
 */
SkillDefinition.prototype.advancementFrame = function(frameType) {
	this._data.frame = {
		type: "advancement",
		data: {
			frame: frameType
		}
	}
	return this;
}

/**
 * Makes skill unlock by default
 * Overrides .cost().
 */
SkillDefinition.prototype.rootSkill = function() {
	this.advancementFrame("goal");
	this._data.required_points = 2147483647;
	this.isRoot = true;
	this.addDescription({
		"color": "gold",
		"text": "\n\n[Root Skill]"
	});
	return this;
}

/**
 * Should be called after adding descriptions.
 * Overrides .rootSkill()
 * @param {integer} cost 
 */
SkillDefinition.prototype.cost = function(cost) {
	this.isRoot = false;
	this._data.cost = cost;
	this.addDescription({
		"color": "dark_green",
		"text": `\n\n[Cost: ${cost} point${cost === 1 ? "" : "s"}]`
	});
	return this;
}

/**
 * Can be used with `amount = 1` to tell users that only 1 skill is needed if it's a unifying branch
 * @param {integer} amount How many skills connected to the skill are needed to unlock it
 * @returns 
 */
SkillDefinition.prototype.requiredSkills = function(amount) {
	this._data.required_skills = amount;
	this.addDescription({
		"color": "red",
		"text": `\n[Skills Needed: ${amount}]`
	});
	return this;
}

SkillDefinition.prototype.flagPlanned = function() {
	this.addDescription({
		"color": "yellow",
		"text": "\n[Planned]"
	});
	return this;
}

/**
 * @param {Object} description
 */
SkillDefinition.prototype.addDescription = function(description) {
	this._data.description.push(description);
	return this;
}

/**
 * @param {string} key 
 */
SkillDefinition.prototype.addKeybindDescription = function(key) {
	this._data.description.push([
		{
			"color": "gray",
			"text": " ["
		},
		{
			"color": "yellow",
			"keybind": key
		},
		{
			"color": "gray",
			"text": "] "
		}
	]);
	return this;
}

/**
 * Resets the description. Useful when wanting to override a template's description.
 * Keep in mind that you will have to call .cost() again otherwise the cost will not display in the description.
 */
SkillDefinition.prototype.resetDescription = function() {
	this._data.description.length = 0;
	return this;
}

/**
 * 
 * @param {string} tag 
 */
SkillDefinition.prototype.addTagReward = function(tag) {
	this._data.rewards.push({
		type: "puffish_skills:tag",
		data: {
			tag: tag
		}
	});
	return this;
}

/**
 * 
 * @param {string} attribute 
 * @param {double} value 
 * @param {"multiply_total" | "multiply_base" | "addition"} operation 
 */
SkillDefinition.prototype.addAttributeReward = function(attribute, value, operation) {
	this._data.rewards.push({
		type: "puffish_skills:attribute",
		data: {
			attribute: attribute,
			value: value,
			operation: operation
		}
	});
	return this;
}