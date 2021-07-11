declare module 'json-work-proof' {

  export default class JWP {
    constructor(difficulty : number);

    decode( token : string ) : any;

    static InvalidFormatError : any;
    static InvalidProofError : any;
    static ExpiredError : any;
  }
}
