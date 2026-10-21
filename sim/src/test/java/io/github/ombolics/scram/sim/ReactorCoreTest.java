package io.github.ombolics.scram.sim;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class ReactorCoreTest {
    private static final double DT = 1.0 / 20.0;

    private static ReactorCore core() {
        return new ReactorCore(1_000_000, 500_000, 5_000);
    }

    @Test
    void rodsFullyInStaysAtAmbient() {
        ReactorCore core = core();
        for (int i = 0; i < 2000; i++) core.step(DT, 1.0);
        assertEquals(ReactorCore.AMBIENT_K, core.temperatureK(), 1e-9);
    }

    @Test
    void withoutCoolantTemperatureKeepsRising() {
        ReactorCore core = core();
        core.setControlRodInsertion(0.0);
        for (int i = 0; i < 2000; i++) core.step(DT, 0.0);
        assertTrue(core.temperatureK() > 500.0);
    }

    @Test
    void scramStopsHeating() {
        ReactorCore core = core();
        core.setControlRodInsertion(0.0);
        for (int i = 0; i < 200; i++) core.step(DT, 1.0);
        core.scram();
        double afterScram = core.temperatureK();
        for (int i = 0; i < 2000; i++) core.step(DT, 1.0);
        assertTrue(core.temperatureK() < afterScram);
    }
}
