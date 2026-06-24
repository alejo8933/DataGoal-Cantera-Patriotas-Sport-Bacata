export interface JugadorAvatarFile {
  bytes: Uint8Array;
  contentType: string;
  extension: string;
}

export interface IJugadorAvatarStorage {
  upload(userId: string, file: JugadorAvatarFile): Promise<string>;
}
