// @ts-nocheck
/**
 * 
 * @param {ServerPlayer_} executor 
 * @param {string} recipientUsername 
 * @param {string} amountString
 */
function PayTransaction(executor, recipientUsername, amountString) {
	this.executor = executor;
	this.recipientUsername = recipientUsername;
	this.server = this.executor.server;

	this.amount = MoneyManager.fromSimpleDollarString(amountString);
	if (this.amount == null) {
		executor.tell("Amount must be either be x, x.x, or x.xx (no negatives)");
		return;
	}

	this.executorUuid = this.executor.uuid.toString();
	this.cancelled = false;

	this.checkEnoughMoney();
	if (this.cancelled) return;

	this.checkRecipient();
	if (this.cancelled) return;

	this.doTransaction();
	this.outputResult();
}

PayTransaction.prototype.checkEnoughMoney = function() {
	const executorMoney = PlayerMoney.get(this.server, this.executorUuid);
	if (executorMoney < this.amount) {
		this.executor.tell(`You'll need ${MoneyManager.toDollarString(this.amount - executorMoney)} more to pay ${this.recipientUsername} ${MoneyManager.toDollarString(this.amount)}.`);
		this.cancel();
	}
}

/**
 * @declares `this.recipientStringUUID`
 */
PayTransaction.prototype.checkRecipient = function() {
	const uuid = PlayerUUIDUsernameBiMap.getUUID(this.server, this.recipientUsername);
	if (uuid == null) {
		this.executor.tell(Text.red(`${this.recipientUsername} does not exist.`));
		this.cancel();
	}
	this.recipientUuid = uuid.toString();
}

PayTransaction.prototype.doTransaction = function() {
	PlayerMoney.add(this.server, this.executorUuid, -this.amount);
	PlayerMoney.add(this.server, this.recipientUuid, this.amount);
}

PayTransaction.prototype.outputResult = function() {
	const amountString = MoneyManager.toDollarString(this.amount);

	/** @type {$ServerPlayer_[]} */
	const players = this.server.playerList.players.toArray();

	let recipient = players.find(player => player.uuid.toString() == this.recipientUuid);
	if (recipient != null) {
		this.server.runCommandSilent(`tellraw ${this.executor.username} ["",{"color":"gray","text":"Paid "},{"selector":"${recipient.username}"},{"color":"yellow","text":" ${amountString}"}]`);
		this.server.runCommandSilent(`tellraw ${recipient.username} ["",{"selector":"${this.executor.username}"},{"color":"gray","text":" paid you"},{"color":"yellow","text":" ${amountString}"}]`);
		return;
	}
	this.server.runCommandSilent(`tellraw ${this.executor.username} ["",{"color":"gray","text":"Paid "},{"color":"dark_gray","text":"${this.recipientUsername}"},{"color":"yellow","text":" ${amountString}"}]`);
}

PayTransaction.prototype.cancel = function() {
	this.cancelled = true;
}