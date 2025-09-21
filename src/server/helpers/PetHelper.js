const PetHelper = {};


/**
 * @template T
 * @param {*} pet 
 * @param {new (...args: any[]) => T} ownerClass
 * @returns 
 */
PetHelper.getPetOwnerPair = function(pet, ownerClass) {
	if (!(pet instanceof $TamableAnimal)) {
		return null;
	}
	const owner = pet.getOwner();
	if (!(owner instanceof ownerClass)) {
		return null;
	}

	return { pet: pet, owner: owner };
}