declare module 'ogl' {
  export class Renderer {
    constructor(options?: {
      dpr?: number
      alpha?: boolean
      antialias?: boolean
    })
    gl: WebGLRenderingContext & {
      canvas: HTMLCanvasElement
      drawingBufferWidth: number
      drawingBufferHeight: number
    }
    render(options: { scene: any }): void
    setSize(width: number, height: number): void
    destroy?(): void
  }

  export class Program {
    constructor(gl: WebGLRenderingContext, options: { vertex: string; fragment: string; uniforms?: Record<string, { value: any }> })
    remove?(): void
  }

  export class Triangle {
    constructor(gl: WebGLRenderingContext)
    remove?(): void
  }

  export class Mesh<TGeometry = any> {
    constructor(gl: WebGLRenderingContext, options: { geometry: TGeometry; program: Program })
    remove?(): void
  }
}
