export class Player {
  public SteamID: string;
  public OwnerSteamID: string;
  public DisplayName: string;
  public Ping: number;
  public Address: string;
  public ConnectedSeconds: number;
  public VoiationLevel: number;
  public CurrentLevel: number;
  public UnspentXp: number;
  public Health: number;
}

export class PlayerWithStatus extends Player {
  online: boolean;
}
