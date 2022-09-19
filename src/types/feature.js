export function FeatureData(gene, cdregion, prot, rna, pub, bond, site, rsite, user, txinit, num) {
  this.gene = gene;
  this.cdregion = cdregion;
  this.prot = prot;
  this.rna = rna;
  this.pub = pub;
  this.bond = bond;
  this.site = site;
  this.rsite = rsite;
  this.user = user;
  this.txinit = txinit;
  this.num = num;
}

/**
 * Complies with `BioSeqId` specification by NCBI.
 *
 * This is a backend object; `RenderFeature` must be used for front-end implementation.
 * @see RenderFeature
 *
 * @param data - NCBI BioSeqId standard data
 * @param data.id {string} - SeqId
 * @param data.data {FeatureData} - NCBI DataAttr content.
 * @param data.location {[number, number]} - Start/end indices
 *
 * @see FeatureData
 */
export class Feature extends Object {
  constructor(data) {
    super(data)

    // NCBI BioSeqId specification
    this.id       = data.id;
    this.data     = data.data;
    this.partial  = data.partial;
    this.except   = data.except;
    this.comment  = data.comment;
    this.product  = data.product;
    this.location = data.location;
    this.qual     = data.qual;
    this.title    = data.title;
    this.ext      = data.ext;
    this.cit      = data.cit;
    this.expEv    = data.expEv;
    this.xref     = data.xref;
  }
}