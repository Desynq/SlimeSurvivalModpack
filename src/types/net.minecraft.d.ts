type CompoundTag_ = import("net.minecraft.nbt.CompoundTag").$CompoundTag$$Original;

type Phantom_ = import("net.minecraft.world.entity.monster.Phantom").$Phantom;

type ShulkerBullet_ = import("net.minecraft.world.entity.projectile.ShulkerBullet").$ShulkerBullet;

type CustomData_ = import("net.minecraft.world.item.component.CustomData").$CustomData;

type Entity_ = import("net.minecraft.world.entity.Entity").$Entity$$Original;

type ItemEntity = Entity_ & import("net.minecraft.world.entity.item.ItemEntity").$ItemEntity$$Original;


type LivingEntity_ = Entity_ & import("net.minecraft.world.entity.LivingEntity").$LivingEntity$$Original;


type Mob_ = LivingEntity_ & import("net.minecraft.world.entity.Mob").$Mob$$Original;

type Bee_ = Mob_ & import("net.minecraft.world.entity.animal.Bee").$Bee$$Original;


type Player_ = LivingEntity_ & import("net.minecraft.world.entity.player.Player").$Player$$Original;
type ServerPlayer_ = Player_ & import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original;

type LevelBlock_ = import("dev.latvian.mods.kubejs.level.LevelBlock").$LevelBlock$$Original;



type GameEvent_ = import("net.minecraft.core.Holder").$Holder<import("net.minecraft.world.level.gameevent.GameEvent").$GameEvent>;