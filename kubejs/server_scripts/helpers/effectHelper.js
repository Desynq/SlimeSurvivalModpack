/**
 * 
 * @param {LivingEntity} entity 
 * @param {string} id 
 * @param {integer} duration 
 * @param {integer} amplifier 
 * @param {boolean} ambient
 * @param {boolean} visible
 * @param {boolean} showIcon 
 * @param {Entity} [source]
 */
function addEffect(entity, id, duration, amplifier, ambient, visible, showIcon, source) {
	// @ts-ignore
	const effect = new $MobEffectInstance(id, duration, amplifier, ambient, visible, showIcon);
	source !== undefined ? entity.addEffect(effect, source) : entity.addEffect(effect);
}