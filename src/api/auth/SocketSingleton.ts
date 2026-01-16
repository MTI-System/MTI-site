type Handler = (ev: MessageEvent) => void;

export class SocketSingleton {
  private static _instance: SocketSingleton | null = null;
  static getInstance(url: string, getHello?: () => string | null) {
    if (!this._instance) this._instance = new SocketSingleton(url, getHello);
    return this._instance;
  }

  private constructor(
    private url: string,
    private getHello?: () => string | null
  ) {}

  private socket: WebSocket | null = null;
  private connectPromise: Promise<WebSocket> | null = null;
  private handlers = new Set<Handler>();
  private fanoutAttached = false;

  private ensureSocket() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return this.socket;
    }
    this.socket = new WebSocket(this.url);
    this.fanoutAttached = false;
    return this.socket;
  }

  async connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return this.socket;
    if (this.connectPromise) return this.connectPromise;

    this.connectPromise = new Promise<WebSocket>((resolve, reject) => {
      const s = this.ensureSocket();

      const cleanup = () => {
        s.removeEventListener("open", onOpen);
        s.removeEventListener("error", onError);
        s.removeEventListener("close", onClose);
      };

      const onOpen = () => {
        cleanup();
        this.connectPromise = null;

        const hello = this.getHello?.();
        if (hello != null) s.send(hello);

        this.attachFanout(s);
        resolve(s);
      };

      const onError = () => {
        cleanup();
        this.connectPromise = null;
        try {
          s.close();
        } catch {
        }
        this.socket = null;
        reject(new Error("WebSocket error"));
      };

      const onClose = () => {
        cleanup();
        this.connectPromise = null;
        this.socket = null;
        reject(new Error("WebSocket closed before open"));
      };

      s.addEventListener("open", onOpen);
      s.addEventListener("error", onError);
      s.addEventListener("close", onClose);
    });

    return this.connectPromise;
  }

  private attachFanout(s: WebSocket) {
    if (this.fanoutAttached) return;
    this.fanoutAttached = true;

    s.addEventListener("message", (ev) => {
      this.handlers.forEach((h) => h(ev));
    });

    s.addEventListener("close", () => {
      this.socket = null;
      this.fanoutAttached = false;
    });
  }

  async send(data: string) {
    const s = await this.connect();
    s.send(data);
  }

  async subscribe(handler: Handler) {
    this.handlers.add(handler);
    await this.connect();

    return () => {
      this.handlers.delete(handler);

      // опционально: если никто не слушает — закрываем соединение
      if (this.handlers.size === 0 && this.socket) {
        try {
          this.socket.close();
        } catch {
        }
        this.socket = null;
      }
    };
  }

  close() {
    if (!this.socket) return;
    try {
      this.socket.close();
    } catch {
    }
    this.socket = null;
    this.connectPromise = null;
    this.fanoutAttached = false;
  }
}
