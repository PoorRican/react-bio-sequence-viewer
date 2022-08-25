export function Data(gene, cdregion, prot, rna, pub, bond, site, rsite, user, txinit, num) {
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
 * NCBI Sequence Feature `BioSeqId`.
 *
 * The only exception to the standard is the `features` features attribute,
 * which contains nested `Feature` objects.
 *
 * @param data - NCBI BioSeqId standard data
 * @param data.data {Data} - NCBI DataAttr content.
 * @param data.features {Feature[]} - Nested `Feature` objects.
 * This means that all `location` attributes should be within `this.location`
 * @constructor
 */
export function Feature(data) {
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
  this.features = data.features;
}

export function generateFeatures(count=15) {
  let features = [];

  for (let i = 0; i < count; i++) {
    let f = {
      id: i.toString(),
      data: null, // simulate data element
      partial: true,
      except: false,
      comment: "this is a comment. There are some words here, but they might not mean anything. Really they're just here to take space...... words...",
      product: 'This is a product. It should really be a link instead of just text...',
      location: i.toString(),
      title: 'Feature #' + i.toString(),
    }
    f = new Feature(f);
    features.push(f)
  }

  return features;
}