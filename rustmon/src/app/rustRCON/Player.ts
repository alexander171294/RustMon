import { DataResponse, VacResponse } from "../api/UserDataDto";

export class Player {
  public SteamID: string = '';
  public OwnerSteamID: string = '';
  public DisplayName: string = '';
  public Ping: number = 0;
  public Address: string = '';
  public ConnectedSeconds: number = 0;
  public VoiationLevel: number = 0;
  public CurrentLevel: number = 0;
  public UnspentXp: number = 0;
  public Health: number = 0;
}

export class PlayerWithStatus extends Player {
  public online: boolean = false;
  public country: string = '';
  public vac?: VacResponse;
  public steamData?: DataResponse;
  public notes: string | undefined;
}
