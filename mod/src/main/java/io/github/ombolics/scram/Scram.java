package io.github.ombolics.scram;

import net.minecraft.world.item.BlockItem;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.fml.common.Mod;
import net.neoforged.neoforge.registries.DeferredBlock;
import net.neoforged.neoforge.registries.DeferredItem;
import net.neoforged.neoforge.registries.DeferredRegister;

@Mod(Scram.MODID)
public final class Scram {
    public static final String MODID = "scram";

    private static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(MODID);
    private static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(MODID);

    // Placeholder block; becomes the reactor core block entity later.
    public static final DeferredBlock<Block> REACTOR_CORE = BLOCKS.registerSimpleBlock(
            "reactor_core", BlockBehaviour.Properties.of().strength(3.0f).requiresCorrectToolForDrops());
    public static final DeferredItem<BlockItem> REACTOR_CORE_ITEM = ITEMS.registerSimpleBlockItem(REACTOR_CORE);

    public Scram(IEventBus modEventBus) {
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);
    }
}
