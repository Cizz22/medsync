'use client';

import FormError from '@/components/FormError';
import OverviewContainer from '@/components/containers/OverviewContainer';
import PageHeader from '@/components/headers/PageHeader';
import { useAccount } from '@/components/providers/account-provider';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectTrigger } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/utils';
import {
  // convertTransformerConfigSchemaToTransformerConfig,
  // convertTransformerConfigToForm,
} from '@/yup-validations/jobs';
import { yupResolver } from '@hookform/resolvers/yup';
// import {
//   CreateUserDefinedTransformerRequest,
//   CreateUserDefinedTransformerResponse,
//   SystemTransformer,
//   TransformerConfig,
//   TransformerSource,
// } from '@neosync/sdk';
import { CheckIcon } from '@radix-ui/react-icons';
import { useRouter, useSearchParams } from 'next/navigation';
// import { usePostHog } from 'posthog-js/react';
import { ReactElement, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { UserDefinedTransformerForm } from './UserDefinedTransformerForms/UserDefinedTransformerForm';
import {
  CREATE_USER_DEFINED_TRANSFORMER_SCHEMA,
  CreateUserDefinedTransformerSchema,
} from './schema';
import { TransformerSource, useGetSystemTransformers } from '@/lib/hooks/useGetSystemTransformers';
import { CreateUserDefinedTransformerResponse } from '@/lib/hooks/useGetUserDefinedTransformers';

function getTransformerSource(sourceStr: string): TransformerSource {
  const sourceNum = parseInt(sourceStr, 10);
  if (isNaN(sourceNum) || !TransformerSource[sourceNum]) {
    return TransformerSource.TRANSFORMER_SOURCE_UNSPECIFIED;
  }
  return sourceNum as TransformerSource;
}

export default function NewTransformer(): ReactElement {
  const { account } = useAccount();

  const { data, isLoading } = useGetSystemTransformers(account?.access_token ?? '');
  const transformers = data ?? [];

  const transformerQueryParam = useSearchParams().get('transformer');
  const transformerSource = getTransformerSource(
    transformerQueryParam ?? TransformerSource.TRANSFORMER_SOURCE_UNSPECIFIED.toString()
  );

  const [openBaseSelect, setOpenBaseSelect] = useState(false);
  // const posthog = usePostHog();

  const form = useForm<CreateUserDefinedTransformerSchema>({
    resolver: yupResolver(CREATE_USER_DEFINED_TRANSFORMER_SCHEMA),
    mode: 'onChange',
    defaultValues: {
      name: '',
      source: transformerSource,
      config: {
        case:'',
        value: {}
      },
      description: '',
    },
    context: { accountId: account?.id ?? '' },
  });

  const router = useRouter();

  async function onSubmit(
    values: CreateUserDefinedTransformerSchema
  ): Promise<void> {
    if (!account) {
      return;
    }
    try {
      const transformer = await createNewTransformer(account.neosync_account_id, values, account.access_token ?? '');
      // posthog.capture('New Transformer Created', {
      //   source: values.source,
      //   sourceName: transformers.find((t) => t.source === values.source)?.name,
      // });
      toast({
        title: 'Successfully created transformer!',
        variant: 'default',
      });
      if (transformer.id) {
        router.push(
          `/dashboard/${account?.neosync_account_id}/transformers/${transformer.id}`
        );
      } else {
        router.push(`/dashboard/${account?.neosync_account_id}/transformers`);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Unable to create transformer',
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    }
  }

  const formSource = form.watch('source');

  const base = transformers.find((t) => t.source === formSource) ?? {
    "name": "",
    "description": "",
    "dataType": "",
    "source": "T",
    "config": {},
    "dataTypes": [],
    "supportedJobTypes": []
  };

  const configCase = form.watch('config.case');

  useEffect(() => {
    if (
      isLoading ||
      base?.source === TransformerSource.TRANSFORMER_SOURCE_UNSPECIFIED ||
      configCase ||
      !transformerQueryParam
    ) {
      return;
    }

    form.setValue('config', { case: '', value: {} });
  }, [isLoading, base.source, configCase, transformerQueryParam]);

  return (
    <OverviewContainer
      Header={<PageHeader header="Create a New Transformer" />}
      containerClassName="px-12 md:px-24 lg:px-32"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Transformer</FormLabel>
                <FormDescription>
                  The system transformer to clone.
                </FormDescription>
                <FormControl>
                  <Select
                    open={openBaseSelect}
                    onOpenChange={setOpenBaseSelect}
                  >
                    <SelectTrigger>
                      {base.name ? base.name : 'Select a transformer'}
                    </SelectTrigger>
                    <SelectContent>
                      <Command className="overflow-auto">
                        <CommandInput placeholder="Search transformers..." />
                        <CommandEmpty>No transformers found.</CommandEmpty>
                        <CommandGroup className="overflow-auto h-[200px]">
                          {transformers.map((t) => (
                            <CommandItem
                              key={`${t.source}`}
                              onSelect={() => {
                                field.onChange(t.source);
                                form.setValue(
                                  'config',
                                  {
                                    case:t.config.case,
                                    value:t.config.value
                                  }
                                );
                                setOpenBaseSelect(false);
                              }}
                              value={t.name}
                            >
                              <CheckIcon
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  base.name === t.name
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {t.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {formSource != null && formSource !== 0 && (
            <div>
              <Controller
                control={form.control}
                name="name"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormDescription>
                      The unique name of the transformer.
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder="Transformer Name"
                        {...field}
                        onChange={async ({ target: { value } }) => {
                          onChange(value);
                          await form.trigger('name');
                        }}
                      />
                    </FormControl>
                    <FormError
                      errorMessage={form.formState.errors.name?.message ?? ''}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-10">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormDescription>
                        The Transformer description.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Transformer description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          <div>
            <UserDefinedTransformerForm
              value={formSource ?? TransformerSource.TRANSFORMER_SOURCE_UNSPECIFIED}
            />
          </div>
          <div className="flex flex-row justify-end">
            <Button type="submit" disabled={!form.formState.isValid}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </OverviewContainer>
  );
}

async function createNewTransformer(
  accountId: string,
  formData: CreateUserDefinedTransformerSchema,
  token:string
): Promise<CreateUserDefinedTransformerResponse> {
  const body = {
    name: formData.name,
    description: formData.description,
    source: formData.source,
    config: {
      case:formData.config.case,
      value:formData.config.value
    }
  };

  const res = await fetch(
    `/api/accounts/${accountId}/transformers/user-defined`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'token':token
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message);
  }
  return await res.json();
}
