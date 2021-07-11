declare module 'json-work-proof' {

  export default class JWP {
    constructor(difficulty : number);

    decode( token : string ) : any;

    static InvalidFormatError : Error;
    static InvalidProofError : Error;
    static ExpiredError : Error;
  }
}
