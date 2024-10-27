import { ChangeDetectorRef, Component, NgZone, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'calculadoradeajustes';

  numFactura = "";
  montoFactura = 0;
  servicioAfectado = "";
  fechaInicio = "";
  fechaFin = "";
  cantidadDias = 0;
  montoSinImpuestos = 0;
  montoConImpuestos = 0
  diasMes = 0;
  formattedText: string = `N° de Factura:\nImporte: $\nMotivo: PROBLEMAS_TECNICOS\nServicio afectado:\nCantidad de días descontados:\nPlazo (*) de días ajustados (desde-hasta): 00/00/0000 - 00/00/0000\nTotal del ajuste: $`;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone, private el: ElementRef, private renderer: Renderer2) { }

  // Funcion para boton borrar y volver todo vacio
  setInicializador() {
    console.log("borrando contenido")
    this.numFactura = "";
    this.montoFactura = 0;
    this.servicioAfectado = "";
    this.fechaInicio = "";
    this.fechaFin = "";
    this.cantidadDias = 0;
    this.montoSinImpuestos = 0;
    this.montoConImpuestos = 0
    this.diasMes = 0;
    this.formattedText = `N° de Factura:\nImporte: $\nMotivo: PROBLEMAS_TECNICOS\nServicio afectado:\nCantidad de días descontados:\nPlazo (*) de días ajustados (desde-hasta): 00/00/0000 - 00/00/0000\nTotal del ajuste: $`;

    window.location.reload();

  }

  // Método para formatear la fecha
  formatDate(dateString: string): string {
    const date = new Date(dateString); // Convertir el string a Date
    var day = ('0' + (date.getDate()+1)).slice(-2); // Obtener el día (dos dígitos)
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Obtener el mes (dos dígitos)
    const year = date.getFullYear(); // Obtener el año

    // asignar cantidad de dias dependiendo el mes de fechaInicio
    this.diasMes = getDaysInMonth(dateString: string);

    if( this.day > this.diaMes ){
      this.day = 1;
    }

    return `${day}/${month}/${year}`; // Formato dd/mm/yyyy
  }

  // Método para calcular la diferencia de días
  calculateDays(fechaInicio: string, fechaFin: string): number {
    const startDate = new Date(fechaInicio); // Convertir fechaInicio a Date
    const endDate = new Date(fechaFin); // Convertir fechaFin a Date

    const differenceInTime = endDate.getTime() - startDate.getTime(); // Diferencia en milisegundos
    const differenceInDays = (differenceInTime / (1000 * 3600 * 24)+1); // Convertir de milisegundos a días

    return Math.ceil(differenceInDays); // Redondear hacia arriba para obtener días completos
  }

  // Método para obtener la cantidad de días del mes de fechaInicio
  getDaysInMonth(dateString: string): number {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Los meses en JS son 0-indexados, por eso sumamos 1

    return new Date(year, month, 0).getDate(); // 0 en el día devuelve el último día del mes
  }

  // Método para mostrar el toast de ERROR
  mostrarToastError() {
    const toastElement = this.el.nativeElement.querySelector('#liveToastError');
    const toast = new (window as any).bootstrap.Toast(toastElement); // Usar window.bootstrap.Toast
    toast.show(); // Mostrar el toast
  }
  mostrarToastAlerta() {
    const toastElement = this.el.nativeElement.querySelector('#liveToastAlert');
    const toast = new (window as any).bootstrap.Toast(toastElement); // Usar window.bootstrap.Toast
    toast.show(); // Mostrar el toast
  }
  mostrarToastCopy() {
    const toastElement = this.el.nativeElement.querySelector('#liveToastCopy');
    const toast = new (window as any).bootstrap.Toast(toastElement); // Usar window.bootstrap.Toast
    toast.show(); // Mostrar el toast
  }
  mostrarToastOk() {
    const toastElement = this.el.nativeElement.querySelector('#liveToastOk');
    const toast = new (window as any).bootstrap.Toast(toastElement); // Usar window.bootstrap.Toast
    toast.show(); // Mostrar el toast
  }

  Validaciones(numFactura: string, montoFactura: string, servicioAfectado: string, fechaInicio: string, fechaFin: string) {
    // VALIDACIONES
    if (!numFactura || !montoFactura || !servicioAfectado || !fechaInicio || !fechaFin) {
      // aca validamos poco a poco
      //Aca mostramos mensaje de error
      console.error('Debe completar todos los campos.');
      this.mostrarToastError(); // Mostrar el toast
      return; //En caso de que no cumpla alguna validacion, se finaliza el proceso
    }
    else{
      // Verificar si la fecha de fin es menor a la fecha de inicio
      const startDate = new Date(fechaInicio);
      const endDate = new Date(fechaFin);
      if (endDate < startDate) {
        console.error('La fecha de fin no puede ser anterior a la fecha de inicio.');
        this.mostrarToastAlerta();
        return; // Evitar que el formulario continue
      }
      else{
        //En caso de que pase las validaciones, llama a CompletarFormulario para continuar con su ejecucion
        this.setCompletarFormulario(numFactura, montoFactura, servicioAfectado, fechaInicio, fechaFin);
        //Mostramos toastOk de calculo exitoso
        this.mostrarToastOk();
      }
    }
  }

  // Formatear todas las variables con datos del form html
  setCompletarFormulario(numFactura: string, montoFactura: string, servicioAfectado: string, fechaInicio: string, fechaFin: string) {
    this.numFactura = numFactura;
    this.montoFactura = parseFloat(montoFactura);
    this.servicioAfectado = servicioAfectado;
    // Formatear las fechas en el formato dd/mm/yyyy
    this.fechaInicio = this.formatDate(fechaInicio);
    this.fechaFin = this.formatDate(fechaFin);
    // Calcular la cantidad de días
    this.cantidadDias = this.calculateDays(fechaInicio, fechaFin);

    // Obtener la cantidad de días del mes de fechaInicio
    this.diasMes = this.getDaysInMonth(fechaInicio);

    //Calcular monto CON impuestos
    this.montoConImpuestos = Math.round((this.montoFactura / this.diasMes * (this.cantidadDias + 1)) * 100) / 100;
    //Calcular monto SIN impuestos
    this.montoSinImpuestos = Math.round((this.montoConImpuestos / 1.21) * 100) / 100;


    // Formatear el texto para el textarea
    this.setFormulario();

    // Forzar la actualización en el DOM
    this.cdr.detectChanges();

  }

  // setear formulario con los datos ingresados
  setFormulario() {
    // Formatear el texto para el textarea
    this.formattedText = `N° de Factura: ${this.numFactura}\n` +
      `Importe: $${this.montoFactura}\n` +
      `Motivo: PROBLEMAS_TECNICOS\n` +
      `Servicio afectado: ${this.servicioAfectado}\n` +
      `Cantidad de días descontados: ${this.cantidadDias}\n` +
      `Plazo (*) de días ajustados (desde-hasta): ${this.fechaInicio} - ${this.fechaFin}\n` +
      `Total del ajuste: $${this.montoConImpuestos}`;


    console.log(this.formattedText)
  }

  // boton copiar al portapapeles el formulario completo
  copiarAlPortapapeles() {
    // Verificar si el navegador soporta la API del portapapeles
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.formattedText)
        .then(() => {
          console.log("Texto copiado al portapapeles");
          // Mostramos el toastCopy para informar que se copio correctamente
          this.mostrarToastCopy();
        })
        .catch(err => {
          console.error("Error al copiar al portapapeles: ", err);
          alert("Hubo un error al intentar copiar al portapapeles");
        });
    } else {
      // Fallback para navegadores que no soportan la API del portapapeles
      console.warn("El navegador no soporta la API del portapapeles.");
      alert("Tu navegador no soporta esta función.");
    }
  }

}
