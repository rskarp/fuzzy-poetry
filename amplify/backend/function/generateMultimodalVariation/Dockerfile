FROM public.ecr.aws/lambda/python:3.9

WORKDIR /var/task

COPY Pipfile Pipfile.lock ./

RUN pip install pipenv && \
    pipenv install --deploy --system

COPY . .

CMD ["src.index.handler"]