interface InputVerificationStatus {
  isSuccess: boolean
  errorMessage?: string
  errorEnum?: ErrorCode
}

enum ErrorCode {
  UNDEFINED_VALUE,

  //Это по приколу тут //
  WRONG_INPUT_VALUE, //
  ///////////////////////

  //TODO Будущие мы
}
