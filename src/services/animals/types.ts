export type TotalAnimalsPerStageResponse = {
  quarantine: {
    dogs: number;
    cats: number;
    total: number;
  };
  sheltered: {
    dogs: number;
    cats: number;
    total: number;
  };
  adopted: {
    dogs: number;
    cats: number;
    total: number;
  };
};
