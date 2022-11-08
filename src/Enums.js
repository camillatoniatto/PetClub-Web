// const ServiceType = {
//     HOST: 0,
//     WALK_DOG: 1,
//     VET_SERVICE: 2,
//     PET_GROOMING: 3,
//     OTHER: 4
//   };

const enums = {
    ServiceType: [
      {key: '0', value: 'Hospedagem'},
      {key: '1', value: 'Passeio'},
      {key: '2', value: 'Serviço Veterinário'},
      {key: '3', value: 'Banho e Tosa'},
      {key: '4', value: 'Outros'},
    ],
    Genre: [
      {key: '0', value: 'Macho'},
      {key: '1', value: 'Fêmea'}
    ],
    PaymentType: [
      {key: '0', value: 'Cartão de Crédito'},
      {key: '1', value: 'Dinheiro'},
      {key: '2', value: 'Cartão de Débito'},
      {key: '3', value: 'Pix'}
    ],
    SchedulerSituation: [
      {key: '0', value: 'Agendado'},
      {key: '1', value: 'Concluído'},
      {key: '2', value: 'Cancelado'},
      {key: '3', value: 'Em Andamento'}
    ]
}

export default enums;