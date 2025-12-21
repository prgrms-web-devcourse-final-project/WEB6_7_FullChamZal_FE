export type KakaoStatus = string;

export type KakaoPlaceItem = {
  id: string;
  place_name: string;
  x: string; // lng
  y: string; // lat
  address_name?: string;
  road_address_name?: string;
};

export type KakaoCoord2AddressResult = Array<{
  road_address?: { address_name?: string };
  address?: { address_name?: string };
}>;

export type KakaoPlacesService = {
  keywordSearch: (
    query: string,
    callback: (data: KakaoPlaceItem[], status: KakaoStatus) => void
  ) => void;
};

export type KakaoGeocoderService = {
  coord2Address: (
    lng: number,
    lat: number,
    callback: (result: KakaoCoord2AddressResult, status: KakaoStatus) => void
  ) => void;
};

export type KakaoNamespace = {
  maps?: {
    load?: (callback: () => void) => void;
    services?: {
      Places: new () => KakaoPlacesService;
      Geocoder: new () => KakaoGeocoderService;
      Status: { OK: KakaoStatus };
    };
  };
};


