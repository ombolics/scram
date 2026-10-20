package io.github.ombolics.scram.sim;

/**
 * Placeholder reactor core. The numbers are made up to show the structure;
 * real equations come from the system specs in docs/specs.
 *
 * No Minecraft imports allowed in this module.
 */
public final class ReactorCore {
    public static final double AMBIENT_K = 300.0;

    private final double fullPowerWatts;
    private final double heatCapacityJPerK;
    private final double coolingWPerK;

    private double temperatureK = AMBIENT_K;
    private double controlRodInsertion = 1.0; // 0 = fully out, 1 = fully in

    public ReactorCore(double fullPowerWatts, double heatCapacityJPerK, double coolingWPerK) {
        this.fullPowerWatts = fullPowerWatts;
        this.heatCapacityJPerK = heatCapacityJPerK;
        this.coolingWPerK = coolingWPerK;
    }

    public void setControlRodInsertion(double insertion) {
        this.controlRodInsertion = Math.max(0.0, Math.min(1.0, insertion));
    }

    /** Immediately inserts all control rods. */
    public void scram() {
        this.controlRodInsertion = 1.0;
    }

    /**
     * Advances the simulation.
     *
     * @param dtSeconds fixed time step (1/20 s per Minecraft tick)
     * @param coolantFlow 0..1 fraction of nominal coolant flow
     */
    public void step(double dtSeconds, double coolantFlow) {
        double heatInW = fullPowerWatts * (1.0 - controlRodInsertion);
        double heatOutW = coolingWPerK * coolantFlow * (temperatureK - AMBIENT_K);
        temperatureK += (heatInW - heatOutW) * dtSeconds / heatCapacityJPerK;
    }

    public double temperatureK() {
        return temperatureK;
    }

    public double controlRodInsertion() {
        return controlRodInsertion;
    }
}
