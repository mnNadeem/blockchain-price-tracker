export interface ISwapResponse {
  btcReceived: number;
  fee: {
    eth: number;
    dollar: number;
  };
}
