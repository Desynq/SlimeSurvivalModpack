

type Entity_ = import("net.minecraft.world.entity.Entity").$Entity$$Original;

type ItemEntity = Entity_ & import("net.minecraft.world.entity.item.ItemEntity").$ItemEntity$$Original;


type LivingEntity_ = Entity_ & import("net.minecraft.world.entity.LivingEntity").$LivingEntity$$Original;


type Mob_ = LivingEntity_ & import("net.minecraft.world.entity.Mob").$Mob$$Original;

type Bee_ = Mob_ & import("net.minecraft.world.entity.animal.Bee").$Bee$$Original;


type Player_ = LivingEntity_ & import("net.minecraft.world.entity.player.Player").$Player$$Original;
type ServerPlayer_ = Player_ & import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original;



type MinecraftServer_ = import("net.minecraft.server.MinecraftServer").$MinecraftServer$$Original;

type ItemStack_ = import("net.minecraft.world.item.ItemStack").$ItemStack$$Original;

type SuggestionsBuilder_ = import("com.mojang.brigadier.suggestion.SuggestionsBuilder").$SuggestionsBuilder$$Original;

type CommandExecutionContext_ = import("com.mojang.brigadier.context.CommandContext").$CommandContext$$Original<import("net.minecraft.commands.CommandSourceStack").$CommandSourceStack$$Original>;

type CommandSourceStack_ = import("net.minecraft.commands.CommandSourceStack").$CommandSourceStack$$Original;
