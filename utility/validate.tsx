export default function validate(values:any) {
    let errors:any = {};
    if (!values.shop) {
      errors.shop = 'Production Line is required';
    } 
    if (!values.shop_name) {
      errors.shop_name = 'Line Name is required';
    }
    if (!values.location) {
        errors.location = 'Location is required';
      }
    return errors;
  };
  