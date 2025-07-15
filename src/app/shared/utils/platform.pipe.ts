import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'platformLabel',
})
export class PlatformLabelPipe implements PipeTransform {
  // Mapa com os nomes personalizados das plataformas
  private platformLabelMap: Record<number, string> = {
    6: 'PC',
    9: 'PS3',
    48: 'PS4',
    167: 'PS5',
    12: 'Xbox 360', 
    49: 'Xbox One',  
    169: 'Xbox Series',
    130: 'Nintendo Switch',
  };

  transform(platformIds: string): string {
    console.log('Plataformas recebidas no Pipe:', platformIds); // Adicione este console.log

    return platformIds
      .split(',')
      .map((id) => this.platformLabelMap[parseInt(id.trim())] || id) // Usando o mapa de nomes
      .join(', ');
  }
}
