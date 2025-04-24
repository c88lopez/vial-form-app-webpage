"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IForm, IFormSourceRecord } from "@/app/form/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Page() {
  const { id } = useParams();

  const [form, setForm] = useState<IForm | undefined>();
  const [records, setRecords] = useState<IFormSourceRecord[] | undefined>();
  const [newRecord, setNewRecord] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});

  const inputTypes = ["text", "email", "password"];

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_VIAL_FORM_APP_API}/form/${id}`).then(
        (response) => {
          response.json().then((body) => {
            setForm(body.data);
          });
        },
      ),

      fetch(
        `${process.env.NEXT_PUBLIC_VIAL_FORM_APP_API}/form/${id}/record`,
      ).then((response) => {
        response.json().then((body) => {
          setRecords(body.data);
        });
      }),
    ]);
  }, []);

  useEffect(() => {
    if (newRecord) {
      fetch(
        `${process.env.NEXT_PUBLIC_VIAL_FORM_APP_API}/form/${id}/record`,
      ).then((response) => {
        response.json().then((body) => {
          setRecords(body.data);
          setNewRecord(false);
        });
      });
    }
  }, [newRecord]);

  function handleInputChange(fieldIndex: string, value: string) {
    const newAnswers = answers;

    newAnswers[fieldIndex] = value;

    setAnswers(newAnswers);
  }

  function handleCheckboxChange(fieldIndex: string) {
    const newAnswers = answers;

    newAnswers[fieldIndex] = !newAnswers[fieldIndex];

    setAnswers(newAnswers);
  }

  function onSubmit() {
    fetch(
      `${process.env.NEXT_PUBLIC_VIAL_FORM_APP_API}/form/${id}/add-record`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          answers,
        }),
      },
    ).then((response) => {
      if (response.status === 200) {
        setAnswers({});
        toast.success("Record added");
        setNewRecord(true);

        return;
      }

      response.json().then((json) => {
        console.error(json.message);
        toast.error("Error adding form record");
      });
    });
  }

  return (
    <div className="p-3">
      {form && (
        <div>
          <h1 className="bold text-2xl">{form.name}</h1>

          <form
            onSubmit={(e) => {
              e.currentTarget.reset();
              e.preventDefault();
              onSubmit();
            }}
          >
            {Object.keys(form.fields).map((fieldIndex) => {
              const field = form.fields[fieldIndex];

              return (
                <div key={fieldIndex}>
                  <div
                    className="grid w-full max-w-sm items-center gap-1.5 py-3"
                    key={fieldIndex}
                  >
                    {field.question}
                    {field.required && " *"}

                    {field.type === "checkbox" && (
                      <Checkbox
                        name={fieldIndex}
                        required={field.required}
                        onCheckedChange={() => handleCheckboxChange(fieldIndex)}
                      />
                    )}

                    {field.type === "textarea" && (
                      <Textarea
                        name={fieldIndex}
                        required={field.required}
                        onChange={(e) =>
                          handleInputChange(fieldIndex, e.target.value)
                        }
                      />
                    )}

                    {inputTypes.includes(field.type) && (
                      <Input
                        type={field.type}
                        name={fieldIndex}
                        required={field.required}
                        onChange={(e) =>
                          handleInputChange(fieldIndex, e.target.value)
                        }
                      />
                    )}
                  </div>
                </div>
              );
            })}

            <Button type={"submit"}>Add Record</Button>
          </form>

          {!records ||
            (records.length == 0 && <p>No records for this form yet</p>)}

          {records && records.length > 0 && (
            <div className="py-3">
              Records:
              {records.map((data, dataIndex) => (
                <div key={dataIndex} className="border-1 my-2">
                  {data.source_data.map(({ question, answer }, index) => {
                    return (
                      <div key={index} className="my-2">
                        <p>Question: {question}</p>
                        <p>Answer: {answer}</p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
