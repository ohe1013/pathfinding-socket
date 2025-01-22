import { GuestBookPostForm } from "@/types";
import { useEffect, useState } from "react";
interface useFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => void;
  validate: (values: T) => Partial<T>;
}
function useForm<T>({ initialValues, onSubmit, validate }: useFormProps<T>) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<GuestBookPostForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    setIsLoading(true);
    event.preventDefault();
    setErrors(validate(values));
  };

  const clear = () => {
    setValues(initialValues);
    setErrors({});
  };

  useEffect(() => {
    if (isLoading) {
      if (Object.keys(errors).length === 0) {
        onSubmit(values);
        clear();
      }
      setIsLoading(false);
    }
  }, [errors]);

  return {
    values,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    clear,
  };
}

export function postValidation({ name, password }: GuestBookPostForm) {
  const errors: Partial<GuestBookPostForm> = {};
  if (!name) {
    errors.name = "이름이 입력되지 않았습니다.";
  }
  const regex = /^[a-zA-Z0-9]+$/;

  function validateInput(input: string) {
    if (regex.test(input)) {
      return true;
    } else {
      return false;
    }
  }
  if (!password) {
    errors.password = "비밀번호가 입력되지 않았습니다.";
  } else if (!validateInput(password)) {
    errors.password = "영문자와 숫자만 입력 가능합니다.";
  }
  return errors;
}

export default useForm;
